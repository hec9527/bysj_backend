import json
import os

configPath = os.path.join(os.getcwd(), "./config/config.json")

with open(configPath) as f:
    config = json.load(f)

print(config)
