package com.dreamfrag.dreamfrag.repo;

import com.dreamfrag.dreamfrag.domain.Job;
import com.dreamfrag.dreamfrag.domain.Streamer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepo extends JpaRepository<Job, Long> {
    @Query("select j from Job j where j.stage = :inited")
    List<Job> findInited( @Param("inited") String inited);
}
