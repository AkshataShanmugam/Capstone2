import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class NewsTest(unittest.TestCase):

    def setUp(self):
        # Setting up the Chrome WebDriver using WebDriver Manager
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)

        # Open the localhost page where your news.jsx is rendered
        self.driver.get("http://localhost:5173")
        time.sleep(3)  # Wait for the page to load

    def test_empty_keyword(self):
        # Find the input field and simulate submitting with an empty keyword
        search_box = self.driver.find_element(By.NAME, "movieNews")
        search_box.clear()  # Empty the input field
        search_box.send_keys("")  # Empty input
        search_box.send_keys(Keys.RETURN)

        # Assert that the error message appears
        error_message = self.driver.find_element(By.CLASS_NAME, "text-red-500")  # Assuming this class is used for the message
        self.assertIn("Please enter a keyword", error_message.text)

    def test_google_api_news(self):
        # Find the input field and simulate submitting a valid "Avengers" search query
        search_box = self.driver.find_element(By.NAME, "movieNews")
        search_box.clear()  # Clear any previous input
        search_box.send_keys("Avengers")
        search_box.send_keys(Keys.RETURN)
        time.sleep(6)  # Wait for the results to load

        # Verify that the results contain relevant content
        news_titles = self.driver.find_elements(By.CLASS_NAME, "text-xl")  # Replace with actual class or element
        self.assertGreater(len(news_titles), 0, "No news titles found")
        print("First news title:", news_titles[0].text)

    def test_summarize_button_behavior(self):
        search_box = self.driver.find_element(By.NAME, "movieNews")
        search_box.clear()
        search_box.send_keys("Avengers")
        search_box.send_keys(Keys.RETURN)
        time.sleep(6)

        summarize_button = self.driver.find_element(By.ID, "summarizeButton")
        self.assertTrue(summarize_button.is_displayed())
        summarize_button.click()

        # Wait for summarization to complete
        time.sleep(10)

        # Verify that the summarized content is displayed
        summarized_content = self.driver.find_elements(By.CLASS_NAME, "summarized-content-class")  # Class for summarized content
        self.assertGreater(len(summarized_content), 0, "Summarized content not displayed")

    def tearDown(self):
        # Close the browser window after the test is done
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
