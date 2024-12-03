import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from base_test import BaseTest

class ChatTest(BaseTest):
    def test_chat_functionality(self):
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)

        chat_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-chat']")
        chat_menu_item.click()
        time.sleep(3)

        sidebar_toggle_button.click()

        page_title = self.driver.find_element(By.TAG_NAME, "h1").text
        self.assertEqual(page_title, "Movie-Bot", "Failed to navigate to the Chat page.")

        chat_input = self.driver.find_element(By.XPATH, "//textarea[@placeholder='Ask Chatbot']")

        test_message = "Hello, this is a test message!"
        chat_input.clear()
        chat_input.send_keys(test_message)
        
        send_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
        send_button.click()

        WebDriverWait(self.driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "bot-message"))
        )

        bot_messages = self.driver.find_elements(By.CLASS_NAME, "bot-message")
        self.assertGreater(len(bot_messages), 0, "Bot response not found in the chat history.")

        last_bot_message = bot_messages[-1]
        self.assertTrue(last_bot_message.is_displayed(), "Last bot message is not visible.")
        self.assertNotEqual(last_bot_message.text.strip(), '', "Bot's response is empty.")

        user_messages = self.driver.find_elements(By.CSS_SELECTOR, ".bg-blue-500")
        self.assertGreater(len(user_messages), 0, "User's message not found in the chat history.")
