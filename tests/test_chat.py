import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from base_test import BaseTest

class NewsTest(BaseTest):

    def test_chat_functionality(self):
        # Navigate to the Chat page via the sidebar
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)  # Wait for the sidebar to toggle

        chat_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-chat']")
        chat_menu_item.click()
        time.sleep(3)  # Wait for the chat page to load

        # Close the sidebar after navigating to the chat page
        sidebar_toggle_button.click()  # This will close the sidebar

        # Verify we are on the Chat page
        page_title = self.driver.find_element(By.TAG_NAME, "h1").text
        self.assertEqual(page_title, "Movie-Bot", "Failed to navigate to the Chat page.")

        # Locate the chat input box (textarea)
        chat_input = self.driver.find_element(By.XPATH, "//textarea[@placeholder='Ask Chatbot']")

        # Send a message
        test_message = "Hello, this is a test message!"
        chat_input.clear()
        chat_input.send_keys(test_message)
        
        # Locate the send button and click it
        send_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        send_button.click()
        
        # Wait for the bot's response (wait for the bot message to appear)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "bot-message"))  # Adjust this class if needed
        )
        
        # Assert that at least one bot message appears in the chat history
        bot_messages = self.driver.find_elements(By.CLASS_NAME, "bot-message")
        self.assertGreater(len(bot_messages), 0, "Bot response not found in the chat history.")
        
        # Optional: Assert that the last message is from the bot and contains a response
        last_bot_message = bot_messages[-1]
        self.assertTrue(last_bot_message.is_displayed(), "Last bot message is not visible.")
        self.assertNotEqual(last_bot_message.text.strip(), '', "Bot's response is empty.")
        
        # Optional: Verify that the user message is present as well
        user_messages = self.driver.find_elements(By.CSS_SELECTOR, ".bg-blue-500")  # Assuming this class represents user messages
        self.assertGreater(len(user_messages), 0, "User's message not found in the chat history.")
