package com.dreamfrag.dreamfrag.repo;

import com.dreamfrag.dreamfrag.domain.Streamer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface StreamerRepo extends JpaRepository<Streamer, Long> {
}
