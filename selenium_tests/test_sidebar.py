import time
from selenium.webdriver.common.by import By
from base_test import BaseTest

class SidebarNavigationTest(BaseTest):
    def test_sidebar_navigation(self):
        sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
        sidebar_toggle_button.click()
        time.sleep(2)

        menu_items = [
            {"test_id": "menu-item-analytics", "page_name": "Analytics"},
            {"test_id": "menu-item-favorites", "page_name": "Favorites"},
            {"test_id": "menu-item-chat", "page_name": "Chat"},
            {"test_id": "menu-item-news", "page_name": "News"}
        ]

        for item in menu_items:
            menu_item = self.driver.find_element(By.CSS_SELECTOR, f"[data-testid='{item['test_id']}']")
            menu_item.click()
            time.sleep(2)
        sidebar_toggle_button.click()
