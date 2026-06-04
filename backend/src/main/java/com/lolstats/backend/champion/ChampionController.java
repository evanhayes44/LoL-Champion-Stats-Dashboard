package com.lolstats.backend.champion;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/champions")
@RequiredArgsConstructor
public class ChampionController {

    private final ChampionService championService;

    @GetMapping
    public List<Champion> getAll() {
        return championService.findAll();
    }

    @GetMapping("/{riotId}")
    public ResponseEntity<Champion> getByRiotId(@PathVariable String riotId) {
        return championService.findByRiotId(riotId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}