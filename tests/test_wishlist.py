# import time
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from base_test import BaseTest

# class WishlistTest(BaseTest):
#     def test_add_to_wishlist(self):
#         search_box = self.driver.find_element(By.NAME, "movieNews")
#         search_box.clear()
#         search_box.send_keys("Avengers")
#         search_box.send_keys(Keys.RETURN)
        
#         time.sleep(3)

#         article_title_element = self.driver.find_elements(By.CLASS_NAME, "text-xl")[0]
#         article_title = article_title_element.text

#         add_to_wishlist_button = self.driver.find_elements(By.CLASS_NAME, "w-5")[0]
#         add_to_wishlist_button.click()
        
#         sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
#         sidebar_toggle_button.click()
#         time.sleep(1)

#         wishlist_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-favorites']")
#         wishlist_menu_item.click()
#         time.sleep(1)

#         page_title = self.driver.find_element(By.TAG_NAME, "h1").text
#         self.assertEqual(page_title, "My Wishlist", "Failed to navigate to the Wishlist page.")
        
#         time.sleep(2)
#         wishlist_titles = [item.text for item in self.driver.find_elements(By.CLASS_NAME, "text-xl")]
#         self.assertIn(article_title, wishlist_titles, "The article was not found in the wishlist!")

#         print(f"Verified: '{article_title}' is in the wishlist.")

#   # def test_delete_from_wishlist(self):
#     #     sidebar_toggle_button = self.driver.find_element(By.CLASS_NAME, "h-8")
#     #     sidebar_toggle_button.click()
#     #     time.sleep(1)

#     #     wishlist_menu_item = self.driver.find_element(By.CSS_SELECTOR, "[data-testid='menu-item-favorites']")
#     #     wishlist_menu_item.click()
#     #     time.sleep(1)

#     #     page_title = self.driver.find_element(By.TAG_NAME, "h1").text
#     #     self.assertEqual(page_title, "My Wishlist", "Failed to navigate to the Wishlist page.")

#     #     wishlist_items = self.driver.find_elements(By.CLASS_NAME, "text-xl")
#     #     self.assertGreater(len(wishlist_items), 0, "No items found in the wishlist to delete.")
#     #     first_item_title = wishlist_items[0].text

#     #     delete_buttons = self.driver.find_elements(By.CLASS_NAME, "delete-button-class")
#     #     self.assertGreater(len(delete_buttons), 0, "No delete button found for wishlist items.")
#     #     delete_buttons[0].click()
#     #     time.sleep(1)

#     #     self.driver.refresh()
#     #     time.sleep(2)

#     #     updated_wishlist_titles = [item.text for item in self.driver.find_elements(By.CLASS_NAME, "text-xl")]
#     #     self.assertNotIn(first_item_title, updated_wishlist_titles, "The item was not deleted from the wishlist.")

#     #     print(f"Verified: '{first_item_title}' was successfully deleted from the wishlist.")
