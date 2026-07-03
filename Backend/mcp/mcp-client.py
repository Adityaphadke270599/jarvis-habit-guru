import asyncio
import sys

from mcp.client.stdio import stdio_client
from mcp import ClientSession, StdioServerParameters
from dotenv import load_dotenv
from anthropic.lib.tools.mcp import async_mcp_tool 
from anthropic import AsyncAnthropic


load_dotenv()
client = AsyncAnthropic()

server_params = StdioServerParameters(
    command = sys.executable,
    args = ["Backend/mcp/mcp-server.py"],
)

async def main():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            tools_result = await session.list_tools()
            tools = [async_mcp_tool(t, session) for t in tools_result.tools]

            messages = []
            print("Jarvis is ready. Type 'quit' to exit.")
            while True:
                user_input = input("\nYou: ")
                if user_input.strip().lower() == "quit":
                    break

                messages.append({"role": "user", "content": user_input})

                runner = client.beta.messages.tool_runner(
                    model="claude-opus-4-8",
                    max_tokens=4096,
                    system="You are Jarvis, a British-gentleman AI habit coach. Distinguished, dryly witty, warm. No emojis, no exclamation points.",
                    messages=messages,
                    tools=tools,
                )

                final_message = None
                async for message in runner:
                    final_message = message

                text = "".join(b.text for b in final_message.content if b.type == "text")
                print(f"\nJarvis: {text}")
                messages.append({"role": "assistant", "content": final_message.content})


if __name__ == "__main__":
    asyncio.run(main())

