package com.dreamfrag.dreamfrag.controller;

import com.dreamfrag.dreamfrag.domain.Job;
import com.dreamfrag.dreamfrag.domain.Streamer;
import com.dreamfrag.dreamfrag.repo.JobRepo;
import com.dreamfrag.dreamfrag.repo.StreamerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("streamer")
public class StreamerController {
    @Autowired
    StreamerRepo streamerRepo;
    @Autowired
    JobRepo jobRepo;

    @GetMapping("")
    public List<Streamer> list() {
        return streamerRepo.findAll();
    }

    @GetMapping("/jobs")
    public List<Job> joblist() {
        return jobRepo.findInited("inited");
    }

    @PostMapping("/create")
    public Streamer create(@RequestBody Streamer streamer) {
        return streamerRepo.save(streamer);
    }

    @PostMapping("/job")
    public Job createJob(@RequestBody Job job) {
        return jobRepo.save(job);
    }

}
