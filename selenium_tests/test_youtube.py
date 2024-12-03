import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from base_test import BaseTest

class YoutubeDataTest(BaseTest):
    def test_youtube_search_with_no_input(self):
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)
    
        analytics_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-analytics']")
        analytics_menu_item.click()
        time.sleep(2)
        sidebar_toggle_button.click()
    
        youtube_data_button = self.driver.find_element(By.CLASS_NAME, "youtube_data")  # Button to navigate to Google Trends
        youtube_data_button.click()
        time.sleep(2)

        search_button = self.driver.find_element(By.CSS_SELECTOR, ".search-button")
        search_button.click()
        time.sleep(2)

        
    def test_navigate_to_navigate_and_type(self):
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)
    
        analytics_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-analytics']")
        analytics_menu_item.click()
        time.sleep(2)
        sidebar_toggle_button.click()
    
        youtube_data_button = self.driver.find_element(By.CLASS_NAME, "youtube_data")  # Button to navigate to Google Trends
        youtube_data_button.click()
        time.sleep(2)

        input_bar = self.driver.find_element(By.ID, "youtube-search-input")

        test_message = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        input_bar.send_keys(test_message)
        time.sleep(2)
    
        assert input_bar.get_attribute("value") == test_message, "Input bar value does not match the expected text."
    
        search_button = self.driver.find_element(By.CSS_SELECTOR, ".search-button")
        search_button.click()
        time.sleep(2)

        # Verify that the summary sections are displayed correctly
        try:
            overall_summary_section = WebDriverWait(self.driver, 400).until(
                EC.visibility_of_element_located((By.XPATH, "//h3[contains(text(), 'Overall Summary')]"))
            )
            assert overall_summary_section.is_displayed(), "Overall Summary section is not visible"
            print("Overall Summary section is visible")
            
        except Exception as e:
            print(f"Test failed due to: {str(e)}")
            assert False, "Summary generation failed or some sections were not found"