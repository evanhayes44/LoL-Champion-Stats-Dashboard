package com.lolstats.backend.champion;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ddragon")
@RequiredArgsConstructor
public class DataDragonController {

    private final DataDragonClient dataDragonClient;

    @GetMapping("/api/versions.json")
    public List<String> getVersions() {
        return dataDragonClient.fetchVersions();
    }

    @GetMapping("/cdn/{version}/data/en_US/champion.json")
    public JsonNode getChampionSummary(@PathVariable String version) {
        return dataDragonClient.fetchChampionSummary(version);
    }

    @GetMapping("/cdn/{version}/data/en_US/champion/{championId}.json")
    public JsonNode getChampionDetail(@PathVariable String version, @PathVariable String championId) {
        return dataDragonClient.fetchChampionDetail(version, championId);
    }

    // Compatibility route for existing frontend path usage.
    @GetMapping("/cdn/{version}/data/en_US/dsf/{championId}.json")
    public JsonNode getChampionDetailLegacy(@PathVariable String version, @PathVariable String championId) {
        return dataDragonClient.fetchChampionDetail(version, championId);
    }
}
