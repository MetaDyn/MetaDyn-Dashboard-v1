using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Text;
using System;
using System.Collections.Generic;

public class UnitySupabaseClient : MonoBehaviour
{
    [Header("Supabase Configuration")]
    [SerializeField] private string supabaseUrl = "YOUR_SUPABASE_URL";
    [SerializeField] private string supabaseAnonKey = "YOUR_SUPABASE_KEY";

    private string aiActivitiesEndpoint;
    private string leaderboardEndpoint;

    void Awake()
    {
        // Initialize endpoints
        aiActivitiesEndpoint = $"{supabaseUrl}/rest/v1/ai_activities";
        leaderboardEndpoint = $"{supabaseUrl}/rest/v1/leaderboard";
    }

    #region AI Activities
    public void LogAIActivity(string agentId, string action, string details)
    {
        var activityData = new AIActivityData
        {
            agent_id = agentId,
            action = action,
            details = details
        };

        StartCoroutine(PostToSupabase(aiActivitiesEndpoint, JsonUtility.ToJson(activityData)));
    }
    #endregion

    #region Leaderboard
    public void SubmitScore(string playerName, int score)
    {
        var scoreData = new LeaderboardData
        {
            player_name = playerName,
            score = score
        };

        StartCoroutine(PostToSupabase(leaderboardEndpoint, JsonUtility.ToJson(scoreData)));
    }

    // New method to fetch top 10 scores
    public void GetTopScores(System.Action<List<LeaderboardEntry>> onSuccess, System.Action<string> onError = null)
    {
        StartCoroutine(FetchTopScores(onSuccess, onError));
    }

    private IEnumerator FetchTopScores(System.Action<List<LeaderboardEntry>> onSuccess, System.Action<string> onError)
    {
        // Build the query URL with parameters
        string queryUrl = $"{leaderboardEndpoint}?select=player_name,score,timestamp&order=score.desc&limit=10";

        using (UnityWebRequest request = new UnityWebRequest(queryUrl, "GET"))
        {
            request.downloadHandler = new DownloadHandlerBuffer();
            
            // Set required headers
            request.SetRequestHeader("apikey", supabaseAnonKey);
            request.SetRequestHeader("Authorization", $"Bearer {supabaseAnonKey}");

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Error fetching leaderboard: {request.error}");
                onError?.Invoke(request.error);
            }
            else
            {
                try
                {
                    // Parse the JSON array response
                    string jsonResponse = request.downloadHandler.text;
                    LeaderboardEntryArray leaderboardArray = JsonUtility.FromJson<LeaderboardEntryArray>("{\"entries\":" + jsonResponse + "}");
                    onSuccess(new List<LeaderboardEntry>(leaderboardArray.entries));
                }
                catch (Exception e)
                {
                    Debug.LogError($"Error parsing leaderboard data: {e.Message}");
                    onError?.Invoke(e.Message);
                }
            }
        }
    }
    #endregion

    private IEnumerator PostToSupabase(string endpoint, string jsonData)
    {
        using (UnityWebRequest request = new UnityWebRequest(endpoint, "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();

            request.SetRequestHeader("apikey", supabaseAnonKey);
            request.SetRequestHeader("Authorization", $"Bearer {supabaseAnonKey}");
            request.SetRequestHeader("Content-Type", "application/json");
            request.SetRequestHeader("Prefer", "return=minimal");

            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Error posting to Supabase: {request.error}");
                Debug.LogError($"Response: {request.downloadHandler.text}");
            }
            else
            {
                Debug.Log($"Successfully posted to {endpoint.Substring(endpoint.LastIndexOf('/'))}");
            }
        }
    }

    #region Data Classes
    [Serializable]
    private class AIActivityData
    {
        public string agent_id;
        public string action;
        public string details;
    }

    [Serializable]
    private class LeaderboardData
    {
        public string player_name;
        public int score;
    }

    [Serializable]
    public class LeaderboardEntry
    {
        public string player_name;
        public int score;
        public string timestamp;
    }

    [Serializable]
    private class LeaderboardEntryArray
    {
        public LeaderboardEntry[] entries;
    }
    #endregion
}
