# Train-Test Split
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

class ScriptDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts.iloc[idx]
        label = self.labels.iloc[idx]
        encoding = self.tokenizer(
            text,
            padding='max_length',
            truncation=True,
            max_length=self.max_len,
            return_tensors="pt"
        )
        return {**{k: v.squeeze() for k, v in encoding.items()}, 'labels': torch.tensor(label, dtype=torch.float)}

# Function to scale ratings
def scale_rating(rating):
    return (rating - 1) / 9  # Scale between 0 and 1

# Function to unscale ratings
def unscale_rating(scaled_rating):
    return scaled_rating * 9 + 1  # Convert back to the range [1, 10]

# Prepare Tokenizer and Model
distilbert_tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
distilbert_model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=1)

# Scale the ratings
train_df['scaled_rating'] = train_df['rating'].apply(scale_rating)
val_df['scaled_rating'] = val_df['rating'].apply(scale_rating)

# Prepare Datasets
train_dataset_distilbert = ScriptDataset(train_df['combined_features'], train_df['scaled_rating'], distilbert_tokenizer)
val_dataset_distilbert = ScriptDataset(val_df['combined_features'], val_df['scaled_rating'], distilbert_tokenizer)

# Training Function
def train_model(model, train_dataset, val_dataset):
    training_args = TrainingArguments(
        output_dir='./results_distilbert_all_20',
        num_train_epochs=20,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs_distilbert_all_20',
        logging_steps=10,
        evaluation_strategy="epoch",
        fp16=True,  # Enable mixed precision
        dataloader_num_workers=4,
        report_to="none",  # Disable reporting to WandB or similar
        save_strategy="epoch",  # Save checkpoints at the end of each epoch
        save_total_limit=3,  # Limit number of saved checkpoints
        load_best_model_at_end=True,  # Automatically load the best model
        ddp_find_unused_parameters=False  # Optimize for DDP
    )

    # Trainer class automatically uses multiple GPUs if available
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )

    trainer.train()

# Check CUDA availability
if torch.cuda.device_count() > 1:
    print(f"Using {torch.cuda.device_count()} GPUs for training!")
else:
    print("Only one GPU detected.")

# Train the DistilBERT model
print("Training DistilBERT model...")
train_model(distilbert_model, train_dataset_distilbert, val_dataset_distilbert)

# Define a function for inference
def predict(model, tokenizer, text, max_len=512):
    model.eval()  # Set model to evaluation mode
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")  # Check for GPU availability

    # Move model to the same device
    model.to(device)

    # Tokenize input text
    encoding = tokenizer(text, padding='max_length', truncation=True, max_length=max_len, return_tensors="pt")

    # Move input encoding to the correct device
    encoding = {k: v.to(device) for k, v in encoding.items()}

    with torch.no_grad():
        # Make prediction
        outputs = model(**encoding)
        # Get the raw prediction and unscale it to the range [1, 10]
        scaled_predicted_rating = outputs.logits.squeeze().item()
        predicted_rating = unscale_rating(scaled_predicted_rating)
    return predicted_rating

# Test the DistilBERT model on the validation set
print("Testing DistilBERT model...\n")
for idx, row in val_df.sample(5, random_state=42).iterrows():
    movie_name = row['title'] if 'title' in row else 'Unknown Title'  # Check for the 'title' column
    script = row['script_content']
#     actual_rating = scaler.inverse_transform([[row['rating']]])[0][0]
    actual_rating = row['rating']
    predicted_rating = predict(distilbert_model, distilbert_tokenizer, script)
    print(f"Movie: {movie_name}\nDistilBERT - Actual Rating: {actual_rating:.1f}, Predicted Rating: {predicted_rating:.1f}\n")
