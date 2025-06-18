using UnityEngine;
using System.Collections.Generic;

public class UnitySupabaseClientExample : MonoBehaviour
{
    private UnitySupabaseClient supabaseClient;

    void Start()
    {
        supabaseClient = GetComponent<UnitySupabaseClient>();
        
        // Example: Fetch top scores when the game starts
        FetchTopScores();
    }

    // Example of logging AI behavior
    void LogAIBehavior()
    {
        supabaseClient.LogAIActivity(
            "agent_001",
            "pathfinding",
            "Found path to target at (10, 0, 5)"
        );
    }

    // Example of submitting a player score
    void SubmitPlayerScore()
    {
        supabaseClient.SubmitScore("Player1", 1000);
    }

    // Example of fetching and displaying top scores
    void FetchTopScores()
    {
        supabaseClient.GetTopScores(
            // Success callback
            (scores) => {
                Debug.Log("Top 10 Scores:");
                foreach (var entry in scores)
                {
                    Debug.Log($"{entry.player_name}: {entry.score} ({entry.timestamp})");
                }
            },
            // Error callback
            (error) => {
                Debug.LogError($"Failed to fetch scores: {error}");
            }
        );
    }
}
