import asyncio
import os
import sys

# Add the Backend directory to the python path so it can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.ai.agents import agent_team

def run_test():
    sys.stdout.reconfigure(encoding='utf-8')
    print("🚀 Starting AI Orchestrator Test...")
    print("Sending prompt: 'The plant has been diagnosed with Powdery Mildew. Environment: Indoor.'\n")
    
    # Run the agent team synchronously for the test
    response = agent_team.run("The plant has been diagnosed with Powdery Mildew. Environment: Indoor. Please generate a full report.")
    
    print("✅ Received Response from AI Team:\n")
    print("==================================================")
    print(response.content)
    print("==================================================")

if __name__ == "__main__":
    run_test()
