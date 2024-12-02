# import time
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from base_test import BaseTest

# class NewsTest(BaseTest):
    # def test_empty_keyword(self):
    #     search_box = self.driver.find_element(By.NAME, "movieNews")
    #     search_box.clear()
    #     search_box.send_keys("")  # Empty input
    #     search_box.send_keys(Keys.RETURN)

    #     error_message = self.driver.find_element(By.CLASS_NAME, "text-red-500")
    #     self.assertIn("Please enter a keyword", error_message.text)

    # def test_google_api_news(self):
    #     search_box = self.driver.find_element(By.NAME, "movieNews")
    #     search_box.clear()
    #     search_box.send_keys("Avengers")
    #     search_box.send_keys(Keys.RETURN)
    #     time.sleep(6)

    #     news_titles = self.driver.find_elements(By.CLASS_NAME, "text-xl")
    #     self.assertGreater(len(news_titles), 0, "No news titles found")
    #     print("First news title:", news_titles[0].text)

    # def test_summarize_button_behavior(self):
    #     search_box = self.driver.find_element(By.NAME, "movieNews")
    #     search_box.clear()
    #     search_box.send_keys("Avengers")
    #     search_box.send_keys(Keys.RETURN)
    #     time.sleep(6)

    #     summarize_button = self.driver.find_element(By.ID, "summarizeButton")
    #     self.assertTrue(summarize_button.is_displayed())
    #     summarize_button.click()

    #     time.sleep(10)

    #     summarized_content = self.driver.find_elements(By.CLASS_NAME, "summarized-content-class")
    #     self.assertGreater(len(summarized_content), 0, "Summarized content not displayed")
