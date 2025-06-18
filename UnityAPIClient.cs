using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Text;

public class UnityAPIClient : MonoBehaviour
{
    [SerializeField]
    private string apiBaseUrl = "http://localhost:3001/api"; // Change this to your API URL

    public void LogAIActivity(string agentId, string action, string details)
    {
        StartCoroutine(PostAIActivity(agentId, action, details));
    }

    public void SubmitScore(string playerName, int score)
    {
        StartCoroutine(PostScore(playerName, score));
    }

    private IEnumerator PostAIActivity(string agentId, string action, string details)
    {
        var activityData = new
        {
            agent_id = agentId,
            action = action,
            details = details
        };

        string json = JsonUtility.ToJson(activityData);
        using (UnityWebRequest request = CreatePostRequest($"{apiBaseUrl}/activity", json))
        {
            yield return request.SendWebRequest();
            HandleResponse(request);
        }
    }

    private IEnumerator PostScore(string playerName, int score)
    {
        var scoreData = new
        {
            player_name = playerName,
            score = score
        };

        string json = JsonUtility.ToJson(scoreData);
        using (UnityWebRequest request = CreatePostRequest($"{apiBaseUrl}/leaderboard", json))
        {
            yield return request.SendWebRequest();
            HandleResponse(request);
        }
    }

    private UnityWebRequest CreatePostRequest(string url, string json)
    {
        var request = new UnityWebRequest(url, "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");
        return request;
    }

    private void HandleResponse(UnityWebRequest request)
    {
        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError($"API Error: {request.error}");
            Debug.LogError($"Response: {request.downloadHandler.text}");
        }
        else
        {
            Debug.Log("API request successful");
        }
    }
}

// Example usage in Unity:
/*
public class GameManager : MonoBehaviour
{
    private UnityAPIClient apiClient;

    void Start()
    {
        apiClient = GetComponent<UnityAPIClient>();
    }

    void LogSomeActivity()
    {
        apiClient.LogAIActivity("agent_001", "move", "Moved to position (10, 5, 3)");
    }

    void SubmitPlayerScore()
    {
        apiClient.SubmitScore("Player1", 1000);
    }
}
*/
