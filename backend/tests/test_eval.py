"""
Tests for DeepEval Cultural Groundedness Benchmark
"""
import pytest
from backend.app.eval.benchmark import evaluate_cultural_groundedness

def test_cultural_groundedness_evaluation():
    scorecard = evaluate_cultural_groundedness(
        input_anchors=["Acne Studios", "Synthwave", "Blade Runner 2049"],
        resolved_qloo_entities=["c90e3920-bf05-4537-903f-085bfe2e41ac"],
        proposed_partnerships=["Acne Studios", "Teenage Engineering", "Keychron"]
    )

    assert scorecard["status"] == "PASS"
    assert scorecard["composite_score"] >= 0.90
    assert scorecard["metrics"]["faithfulness"]["score"] > 0.85
    assert scorecard["metrics"]["cultural_groundedness"]["score"] > 0.85
    assert scorecard["metrics"]["hallucination_resistance"]["score"] > 0.90
