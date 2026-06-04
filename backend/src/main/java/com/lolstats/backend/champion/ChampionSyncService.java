package com.lolstats.backend.champion;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChampionSyncService {

    private final ChampionRepository championRepository;
    private final DataDragonClient dataDragonClient;

    @Transactional
    @EventListener(ApplicationReadyEvent.class)
    public void syncOnStartup() {
        syncChampions();
    }

    @Transactional
    @Scheduled(cron = "0 0 */12 * * *")
    public void syncOnSchedule() {
        syncChampions();
    }

    private void syncChampions() {
        List<Champion> remoteChampions = dataDragonClient.fetchChampions();

        for (Champion remoteChampion : remoteChampions) {
            Champion champion = championRepository.findByRiotId(remoteChampion.getRiotId())
                    .map(existing -> {
                        existing.setName(remoteChampion.getName());
                        existing.setTitle(remoteChampion.getTitle());
                        existing.setImageUrl(remoteChampion.getImageUrl());
                        return existing;
                    })
                    .orElseGet(() -> {
                        Champion created = new Champion();
                        created.setRiotId(remoteChampion.getRiotId());
                        created.setName(remoteChampion.getName());
                        created.setTitle(remoteChampion.getTitle());
                        created.setImageUrl(remoteChampion.getImageUrl());
                        return created;
                    });

            championRepository.save(champion);
        }
    }
}
