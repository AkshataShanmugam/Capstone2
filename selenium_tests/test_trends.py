import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from base_test import BaseTest

class TrendsTest(BaseTest):
    def test_search_with_no_input(self):
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)
    
        analytics_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-analytics']")
        analytics_menu_item.click()
        time.sleep(2)
        sidebar_toggle_button.click()
        
        self.driver.find_element(By.ID, "trends-search-input")

        search_button = self.driver.find_element(By.CSS_SELECTOR, ".search-button")
        search_button.click()
        
    def test_navigate_to_analytics_and_type(self):
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)
    
        analytics_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-analytics']")
        analytics_menu_item.click()
        time.sleep(2)
        sidebar_toggle_button.click()
    
        input_bar = self.driver.find_element(By.ID, "trends-search-input")

        test_message = "Test message for Analytics input"
        input_bar.send_keys(test_message)
        time.sleep(2)
    
        assert input_bar.get_attribute("value") == test_message, "Input bar value does not match the expected text."
    
        search_button = self.driver.find_element(By.CSS_SELECTOR, ".search-button")
        search_button.click()
        time.sleep(2)

        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".result-link"))
            )
            print("At least one URL is present in the search results.")
        except:
            print("No search results found within the given time.")
    
        search_results = self.driver.find_elements(By.CSS_SELECTOR, ".result-link")
        assert len(search_results) > 0, "No search results found."

    def test_navigate_to_analytics_graph(self):
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)
    
        analytics_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-analytics']")
        analytics_menu_item.click()
        time.sleep(2)
        sidebar_toggle_button.click()
    
        input_bar = self.driver.find_element(By.ID, "trends-search-input")

        test_message = "Test message for Analytics input"
        input_bar.send_keys(test_message)
        time.sleep(2)
    
        assert input_bar.get_attribute("value") == test_message, "Input bar value does not match the expected text."
    
        search_button = self.driver.find_element(By.CSS_SELECTOR, ".search-button")
        search_button.click()
        time.sleep(2)
            
        google_trends_button = self.driver.find_element(By.CLASS_NAME, "google_trends_graph")
        google_trends_button.click()

        wait = WebDriverWait(self.driver, 10)
        analytics_element = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "google_trends_graph")))

        assert analytics_element.is_displayed(), "Google Trends graph is not visible as expected."