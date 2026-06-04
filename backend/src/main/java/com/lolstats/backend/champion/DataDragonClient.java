package com.lolstats.backend.champion;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataDragonClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ddragon.base-url}")
    private String baseUrl;

    @Value("${ddragon.champion-version}")
    private String championVersion;

    public List<Champion> fetchChampions() {
        JsonNode rootNode = fetchChampionSummary(championVersion);
        JsonNode dataNode = rootNode.get("data");

        if (dataNode == null || !dataNode.isObject()) {
            throw new IllegalStateException("Data Dragon response did not contain a valid 'data' object");
        }

        List<Champion> champions = new ArrayList<>();
        Iterator<Map.Entry<String, JsonNode>> entries = dataNode.fields();
        while (entries.hasNext()) {
            JsonNode championNode = entries.next().getValue();
            Champion champion = new Champion();
            champion.setRiotId(championNode.get("id").asText());
            champion.setName(championNode.get("name").asText());
            champion.setTitle(championNode.get("title").asText());

            String imageFileName = championNode.get("image").get("full").asText();
            champion.setImageUrl(baseUrl + "/cdn/img/champion/splash/" + imageFileName.replace(".png", "_0.jpg"));

            champions.add(champion);
        }

        return champions;
    }

    public List<String> fetchVersions() {
        String jsonResponse = fetchRawJson(baseUrl + "/api/versions.json");
        try {
            return objectMapper.readValue(jsonResponse, new TypeReference<List<String>>() {
            });
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to parse Data Dragon versions response", ex);
        }
    }

    public JsonNode fetchChampionSummary(String version) {
        String jsonResponse = fetchRawJson(baseUrl + "/cdn/" + version + "/data/en_US/champion.json");
        return parseJson(jsonResponse, "champion summary");
    }

    public JsonNode fetchChampionDetail(String version, String championId) {
        String jsonResponse = fetchRawJson(baseUrl + "/cdn/" + version + "/data/en_US/champion/" + championId + ".json");
        return parseJson(jsonResponse, "champion detail");
    }

    private String fetchRawJson(String url) {
        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            if (jsonResponse == null) {
                throw new IllegalStateException("Data Dragon response was empty for URL: " + url);
            }
            return jsonResponse;
        } catch (RestClientResponseException ex) {
            throw new IllegalStateException("Data Dragon request failed with status " + ex.getRawStatusCode() + " for URL: " + url, ex);
        }
    }

    private JsonNode parseJson(String json, String payloadDescription) {
        try {
            return objectMapper.readTree(json);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to parse Data Dragon " + payloadDescription + " response", ex);
        }
    }
}
