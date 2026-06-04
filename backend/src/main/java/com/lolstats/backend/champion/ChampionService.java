package com.lolstats.backend.champion;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChampionService {

    private final ChampionRepository championRepository;

    public List<Champion> findAll() {
        return championRepository.findAll();
    }

    public Optional<Champion> findByRiotId(String riotId) {
        return championRepository.findByRiotId(riotId);
    }
}
