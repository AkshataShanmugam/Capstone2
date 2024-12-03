import time
import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

class BaseTest(unittest.TestCase):
    def setUp(self):
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service)

        self.driver.get("http://localhost:5173")
        time.sleep(3)  # Wait for the page to load

    def tearDown(self):
        self.driver.quit()
