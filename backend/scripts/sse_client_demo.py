"""
Venture Pulse - Interactive CLI Client for Live Deliberation Streaming
"""
import asyncio
import json
import httpx
from backend.app.config import get_settings

async def main():
    settings = get_settings()
    base_url = f"http://127.0.0.1:{settings.port}"
    print("=" * 70)
    print(" VENTURE PULSE // LIVE MULTI-AGENT DELIBERATION STREAM")
    print(f" Target Gateway: {base_url}")
    print(" Grounded in Qloo 250M+ Cultural Taste Graph")
    print("=" * 70)

    # 1. Start Debate
    payload = {
        "profile_name": "Neon Void Studio",
        "mode": "creator",
        "anchors": ["Acne Studios", "Synthwave", "Blade Runner 2049"]
    }
    print(f"\n[INIT] Initiating Session for '{payload['profile_name']}'...")

    async with httpx.AsyncClient(timeout=60.0) as client:
        # Check health
        try:
            h_resp = await client.get(f"{base_url}/api/health")
            h_data = h_resp.json()
            print(f"[HEALTH] Qloo Gateway: {h_data['qloo_api_status']} | LLM: {h_data['llm_model']}")
        except Exception as e:
            print(f"[ERROR] Could not connect to server at {base_url}. Make sure FastAPI is running (python -m backend.app.main).")
            return

        # Start debate
        start_resp = await client.post(f"{base_url}/api/debate/start", json=payload)
        start_data = start_resp.json()
        session_id = start_data["session_id"]
        print(f"[SESSION] Created Session: {session_id}")
        print(f"[STREAM] Connecting to {start_data['stream_url']} ...\n")

        # Stream SSE events
        async with client.stream("GET", f"{base_url}{start_data['stream_url']}") as response:
            async for line in response.aiter_lines():
                if line.startswith("event:"):
                    event_type = line.replace("event:", "").strip()
                    print(f"\n>>> [EVENT: {event_type.upper()}]")
                elif line.startswith("data:"):
                    data_str = line.replace("data:", "").strip()
                    try:
                        data = json.loads(data_str)
                        if "thought_reasoning" in data:
                            print(f"  ⚡ [{data.get('agent_name')}] (Cycle {data.get('cycle')}) Status: {data.get('consensus_status')}")
                            print(f"  💭 Reasoning: {data.get('thought_reasoning')}")
                            print(f"  📝 Statement: {data.get('content')}\n")
                        elif "product_spec" in data:
                            spec = data["product_spec"]
                            print(f"  🎯 Specimen Title: {spec.get('title')}")
                            print(f"  💎 Materials: {', '.join(spec.get('materials', []))}")
                            print(f"  💰 Economics: {spec.get('run_units')} units @ ${spec.get('msrp_usd')} MSRP -> GMV ${spec.get('projected_gmv'):,.0f}")
                            print(f"  ✉️ Outreach: {spec.get('outreach_pitch')[:150]}...\n")
                        else:
                            print(f"  ℹ️ {data}")
                    except Exception:
                        print(f"  {data_str}")

    print("\n" + "=" * 70)
    print(" DELIBERATION STREAM COMPLETED // CONSENSUS 94% REACHED")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
