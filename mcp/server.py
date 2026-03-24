import os
import httpx
import yaml
from pathlib import Path
from mcp.server.fastmcp import FastMCP
from mcp.server.transport_security import TransportSecuritySettings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastMCP Server
mcp = FastMCP(
    "expense-tracker-mcp",
    transport_security=TransportSecuritySettings(enable_dns_rebinding_protection=False)
)

# Read Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "https://expensesbackend.sarthaksri.xyz/api")
AUTH_TOKEN = os.getenv("AUTH_TOKEN")
BASE_DIR = Path(__file__).parent

# Load Swagger Definitions
try:
    with open(BASE_DIR / "swagger.yaml", "r", encoding="utf-8") as f:
        swagger_spec = yaml.safe_load(f)
except Exception as e:
    print(f"Warning: Could not load swagger.yaml: {e}")
    swagger_spec = {}

def get_swagger_description(path: str, method: str, fallback: str) -> str:
    """Helper to extract summary/description from swagger."""
    try:
        op = swagger_spec.get("paths", {}).get(path, {}).get(method, {})
        summary = op.get("summary", "")
        description = op.get("description", "")
        combined = f"{summary}. {description}".strip()
        return combined if combined else fallback
    except Exception:
        return fallback

# Helper function to construct headers
def get_headers(token: str):
    active_token = token or AUTH_TOKEN
    return {
        "Authorization": f"Bearer {active_token}",
        "Content-Type": "application/json"
    }

@mcp.tool(description=get_swagger_description("/expenses", "get", "Gets all expenses for the currently logged in user."))
def get_expenses(token: str) -> str:
    with httpx.Client() as client:
        try:
            response = client.get(f"{API_BASE_URL}/expenses", headers=get_headers(token))
            response.raise_for_status()
            data = response.json()
            return str(data)
        except Exception as e:
            return f"Error fetching expenses: {str(e)}"

# Extract parameter descriptions from swagger for add_expense if possible, otherwise rely on fallback docstring
add_expense_desc = get_swagger_description("/expenses", "post", "Logs a new expense for the logged in user.")

@mcp.tool(description=f"{add_expense_desc}\n\nArgs:\n    amount: The numerical cost.\n    title: Description of expense.\n    category: Category of expense.\n    date: YYYY-MM-DD\n    token: Auth token.")
def add_expense(amount: float, title: str, category: str, date: str, token: str) -> str:
    payload = {
        "amount": amount,
        "description": title,
        "category": category,
        "date": date
    }
    with httpx.Client() as client:
        try:
            response = client.post(f"{API_BASE_URL}/expenses", json=payload, headers=get_headers(token))
            response.raise_for_status()
            return f"Successfully added expense: {response.json()}"
        except Exception as e:
            return f"Error adding expense: {str(e)}"

@mcp.tool(description=get_swagger_description("/savings-goals", "get", "Gets all active savings goals for the logged in user."))
def get_savings_goals(token: str) -> str:
    with httpx.Client() as client:
        try:
            response = client.get(f"{API_BASE_URL}/savings-goals", headers=get_headers(token))
            response.raise_for_status()
            return str(response.json())
        except Exception as e:
            return f"Error fetching savings goals: {str(e)}"

@mcp.tool(description=get_swagger_description("/monthly-data", "get", "Gets aggregate monthly expense data per category for the user."))
def get_monthly_data(token: str) -> str:
    with httpx.Client() as client:
        try:
            response = client.get(f"{API_BASE_URL}/monthly-data", headers=get_headers(token))
            response.raise_for_status()
            return str(response.json())
        except Exception as e:
            return f"Error fetching monthly data: {str(e)}"

if __name__ == "__main__":
    print(f"Starting MCP Server connecting to API at {API_BASE_URL}", flush=True)
    # Run the FastMCP server with stdio transport built-in
    mcp.run(transport='sse')
