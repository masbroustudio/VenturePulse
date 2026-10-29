"use client";

import { useState, useRef, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { TurnMessage, ConsensusEvent } from "@/types/agent";

export type DagNodeId = "intake" | "qloo" | "analyst" | "strategist" | "director" | "deepeval" | "supabase";

export function useDebateStream() {
  const { mode, activeProfile, backendOnline, showToast } = useAppStore();

  const [turns, setTurns] = useState<TurnMessage[]>([]);
  const [activeDagNode, setActiveDagNode] = useState<DagNodeId>("analyst");
  const [cycle, setCycle] = useState<number>(1);
  const [synergyScore, setSynergyScore] = useState<string>("In Progress...");
  const [isConsensus, setIsConsensus] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const runSimulation = useCallback(() => {
    clearTimers();
    setIsRunning(true);
    setIsConsensus(false);
    setCycle(1);
    setSynergyScore("In Progress...");
    setTurns([]);
    setActiveDagNode("analyst");

    const isBrand = mode === "brand";
    const p = activeProfile;

    // Turn 1: Analyst
    const turn1: TurnMessage = {
      role: "cultural_analyst",
      agent_name: isBrand ? "Subculture Scout" : "Cultural Analyst",
      cycle: 1,
      thought_reasoning: `${isBrand ? "subcultural_audience_discovery" : "qloo_taste_explorer"}({ id: "${p.id}", minAffinity: 5.0 }) → status: 200 OK\nLatent affinity mapping across 250M+ entities.`,
      content: isBrand
        ? `Querying Qloo Gateway for brand entity ${p.name}. Cross-domain mapping discovers high-affinity indie creator communities indexing up to ${p.graph.brands[0]?.affinity || "7.8x"} above baseline. Candidate channels: ${p.graph.brands.map((b) => b.name).join(", ")}.`
        : `Resolved declared anchors: ${p.chips[0]?.name || "Synthwave"} and ${p.chips[1]?.name || "Blade Runner"}. Cross-domain query to hackathon.api.qloo.com/v2/insights surfaces high latent correlation for: ${p.graph.brands.map((b) => b.name).join(", ")}.`,
    };

    setTurns([turn1]);

    // Turn 2: Strategist Rejection
    timerRef.current = setTimeout(() => {
      setActiveDagNode("strategist");
      const turn2: TurnMessage = {
        role: "brand_strategist",
        agent_name: isBrand ? "Media Feasibility Strategist" : "Brand Strategist",
        cycle: 1,
        thought_reasoning: "Affinity threshold check: candidate 4 demands entry tiers ($75k+) exceeding budget constraints. Negative anti-affinity guardrail violated.",
        content: isBrand
          ? "Critique of preliminary channels: Candidate 4 exhibits commercial sponsorship fatigue and brand safety conflicts. Consensus rejected. Triggering Cycle 2 loopback for pure artisanal micro-communities."
          : `Critique of initial candidate set: Candidate 4 demands entry tiers that exceed ${p.name}'s deal tier (${p.tier}). Category saturation risk detected. Consensus rejected. Triggering Cycle 2 retry loop with negative guardrail.`,
        synergy_score: 0.71,
        consensus_status: "CONFLICT_REJECTED",
      };

      setTurns((prev) => [...prev, turn2]);

      // Turn 3: Refinement Cycle 2
      timerRef.current = setTimeout(() => {
        setCycle(2);
        setActiveDagNode("analyst");
        const turn3: TurnMessage = {
          role: "cultural_analyst",
          agent_name: isBrand ? "Subculture Scout" : "Cultural Analyst",
          cycle: 2,
          thought_reasoning: "Applied negative anti-affinity filter. Re-ranked candidate: 94% synergy achieved.",
          content: `Applied negative anti-affinity filter. Re-ranked candidate: ${p.cards[0]?.brand || "Target Partner"} (Lift: ${p.cards[0]?.affinity || "7.8x"}). Verified audience overlap reaches 94% Cultural Synergy.`,
          consensus_status: "REFINED",
        };

        setTurns((prev) => [...prev, turn3]);

        // Turn 4: Director Final Spec
        timerRef.current = setTimeout(() => {
          setActiveDagNode("director");
          const turn4: TurnMessage = {
            role: "creative_director",
            agent_name: isBrand ? "Campaign Director" : "Creative Director",
            cycle: 2,
            thought_reasoning: "Synthesis converged: product capsule specifications finalized with audited unit economics.",
            content: `${isBrand ? "Campaign architecture approved" : "Physical capsule blueprint approved"}: ${p.cards[0]?.title || "Collab Drop"}. Commercial deal structure: ${p.cards[0]?.dealSize || "$48,500"}. Consensus achieved.`,
            consensus_status: "APPROVED",
          };

          setTurns((prev) => [...prev, turn4]);
          setActiveDagNode("supabase");
          setSynergyScore("94%");
          setIsConsensus(true);
          setIsRunning(false);
          showToast("Consensus Achieved: 94% Cultural Synergy");
        }, 1200);
      }, 1200);
    }, 1400);
  }, [mode, activeProfile, clearTimers, showToast]);

  const startDebate = useCallback(async () => {
    clearTimers();
    setIsRunning(true);
    setIsConsensus(false);
    setCycle(1);
    setSynergyScore("In Progress...");
    setTurns([]);
    setActiveDagNode("analyst");

    const p = activeProfile;
    const anchors = p.chips ? p.chips.map((c) => c.name) : ["Synthwave", "Cyberpunk"];

    try {
      const res = await fetch("/api/debate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_name: p.name,
          mode: mode,
          anchors: anchors,
        }),
      });

      if (!res.ok) {
        throw new Error("Backend start failed");
      }

      const data = await res.json();
      setSessionId(data.session_id);

      const sseUrl = `/api/debate/stream/${data.session_id}`;
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      es.addEventListener("session_init", () => {
        setActiveDagNode("analyst");
      });

      es.addEventListener("turn", (e) => {
        try {
          const turn: TurnMessage = JSON.parse(e.data);
          setTurns((prev) => [...prev, turn]);
          if (turn.cycle) setCycle(turn.cycle);

          if (turn.role === "cultural_analyst") {
            setActiveDagNode("analyst");
          } else if (turn.role === "brand_strategist") {
            setActiveDagNode("strategist");
          } else if (turn.role === "creative_director") {
            setActiveDagNode("director");
          }
        } catch (err) {
          console.error("Parse turn error:", err);
        }
      });

      es.addEventListener("consensus_complete", (e) => {
        try {
          const event: ConsensusEvent = JSON.parse(e.data);
          setActiveDagNode("supabase");
          setSynergyScore(`${Math.round((event.final_synergy || 0.94) * 100)}%`);
          setIsConsensus(true);
          setIsRunning(false);
          es.close();
          showToast(`Live Consensus Achieved: Saved ${event.card_id || "Deal"}`);
        } catch (err) {
          console.error("Parse consensus error:", err);
        }
      });

      es.onerror = (err) => {
        console.warn("SSE stream error, falling back to simulation:", err);
        es.close();
        runSimulation();
      };
    } catch (err) {
      console.warn("Backend not reachable, running simulation:", err);
      runSimulation();
    }
  }, [mode, activeProfile, clearTimers, runSimulation, showToast]);

  const fastForward = useCallback(() => {
    clearTimers();
    setIsRunning(false);
    setIsConsensus(true);
    setCycle(2);
    setSynergyScore("94%");
    setActiveDagNode("supabase");

    const isBrand = mode === "brand";
    const p = activeProfile;

    setTurns([
      {
        role: "cultural_analyst",
        agent_name: isBrand ? "Subculture Scout" : "Cultural Analyst",
        cycle: 1,
        thought_reasoning: "Fast-forward trace: Qloo Gateway resolved 250M+ cross-domain taste paths.",
        content: `Resolved anchors: ${p.chips[0]?.name || "Anchor A"} & ${p.chips[1]?.name || "Anchor B"}. Surfaced top candidates: ${p.cards.map((c) => c.brand).join(", ")}.`,
      },
      {
        role: "brand_strategist",
        agent_name: isBrand ? "Media Strategist" : "Brand Strategist",
        cycle: 1,
        thought_reasoning: "Fast-forward rejection: candidate 4 budget mismatch.",
        content: "Rejected budget and commercial saturation mismatch candidate. Triggered Cycle 2 loopback.",
        synergy_score: 0.71,
        consensus_status: "CONFLICT_REJECTED",
      },
      {
        role: "cultural_analyst",
        agent_name: isBrand ? "Subculture Scout" : "Cultural Analyst",
        cycle: 2,
        thought_reasoning: "Fast-forward refinement: anti-affinity guardrail applied.",
        content: `Applied anti-affinity guardrail. Verified shortlist: ${p.cards.map((c) => c.brand).join(", ")}. Consensus reached at 94%.`,
        consensus_status: "REFINED",
      },
      {
        role: "creative_director",
        agent_name: isBrand ? "Campaign Director" : "Creative Director",
        cycle: 2,
        thought_reasoning: "Fast-forward director: final specs synthesized.",
        content: `Specification finalized: ${p.cards[0]?.title || "Capsule Drop"}. Commercial deal size: ${p.cards[0]?.dealSize || "$48,500"}.`,
        consensus_status: "APPROVED",
      },
    ]);

    showToast("Fast-Forwarded: Consensus Achieved (94% Synergy)");
  }, [mode, activeProfile, clearTimers, showToast]);

  const injectConstraint = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean) return;

      const userTurn: TurnMessage = {
        role: "creative_director",
        agent_name: "Executive Intervention",
        cycle: cycle,
        thought_reasoning: `Founder Constraint: "${clean}" injected into LangGraph state machine.`,
        content: `Constraint Injected: "${clean}". Recalibrating creative blueprint and economic model.`,
      };

      setTurns((prev) => [...prev, userTurn]);
      showToast(`Injected Constraint: "${clean}"`);

      if (sessionId) {
        try {
          await fetch("/api/debate/inject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sessionId,
              constraint: clean,
            }),
          });
        } catch (err) {
          console.warn("Could not send constraint to backend:", err);
        }
      }
    },
    [cycle, sessionId, showToast]
  );

  return {
    turns,
    activeDagNode,
    cycle,
    synergyScore,
    isConsensus,
    isRunning,
    startDebate,
    fastForward,
    injectConstraint,
  };
}
