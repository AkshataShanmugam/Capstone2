import json
import re

# Example content from youtube_results.json
content = '''{'positive': 24, 'negative': 26, 'neutral': 0, 'summary': 'Here is the output in JSON format:\n\n{\n"summary": {\n"Positive Comments": {\n"Key themes": [\n"This song is amazing and wonderful.",\n"Reaching 1 billion views is an incredible achievement.",\n"Rickrolling is a fun and memorable meme.",\n"This song is catchy and perfect.",\n"Rick Astley is a talented singer with a unique voice.",\n"The comment section is full of supportive and enthusiastic fans."\n],\n"Summary": "The positive comments are filled with excitement and admiration for the song and its cultural impact."\n},\n"Negative Comments": {\n"Key criticisms": [\n"Some people got tricked into watching the video thinking it was something else.",\n"Rickrolling can be annoying or frustrating for those who get tricked.",\n"Some see the meme as old or overused.",\n"Some dislike the song itself.",\n"This achievement doesn\'t necessarily mean anything significant."\n],\n"Summary": "The negative comments express frustration, annoyance, or skepticism towards the meme and its impact."\n},\n"Neutral Comments": {\n"Key points": [\n"Some people enjoy the song regardless of its connection to the meme.",\n"Some acknowledge the cultural phenomenon but don\'t actively participate.",\n"Some find it entertaining to participate in the meme.",\n"Some see the comment section as a form of online community."\n],\n"Summary": "The neutral comments are more observational, acknowledging the meme\'s existence but not necessarily participating or engaging with it."\n},\n"Overall Summary": "The comment section is largely positive, celebrating the song\'s cultural impact and the achievement of reaching 1 billion views. Some people express frustration or skepticism towards the meme, while others are more neutral."\n}\n}\n}'''

# Extract the JSON object inside the summary key
match = re.search(r'({\n"summary":.*\n}\n}\n})', content, re.DOTALL)
if match:
    json_content = match.group(1)
else:
    print("No JSON object found inside summary.")
    json_content = ""

print(json_content)

# Replace single quotes with double quotes
json_content = json_content.replace("'", '"')

# Fix escaped single quotes within strings
json_content = re.sub(r'\\"', "'", json_content)

# Replace newline characters with escaped newline characters
json_content = json_content.replace('\n', '\\n')

# Load the content as JSON
try:
    json_data = json.loads(json_content)
    formatted_json = json.dumps(json_data, indent=2)
    print(formatted_json)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")