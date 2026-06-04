package com.lolstats.backend.champion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChampionRepository extends JpaRepository<Champion, Long> {

    Optional<Champion> findByRiotId(String riotId);
}
