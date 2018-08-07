package com.fitech.hr.util;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class IDGenerator {
    private static final long ONE_STEP = 10;
    private static final Lock LOCK = new ReentrantLock();
    private static long lastTime = System.currentTimeMillis();
    private static short lastCount = 0;
    private static final Logger logger = LoggerFactory.getLogger(IDGenerator.class);

    private IDGenerator() {
    }

    public static String getUid() {
        int count = 0;
        LOCK.lock();
        if (lastCount == ONE_STEP) {
            boolean done = false;
            while (!done) {
                long now = System.currentTimeMillis();
                if (now == lastTime) {
                    Thread.currentThread();
                    try {
                        Thread.sleep(1);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        logger.error("主键生成报错");
                    }
                    continue;
                } else {
                    lastTime = now;
                    lastCount = 0;
                    done = true;
                }
            }
        }
        count = lastCount++;
        LOCK.unlock();
        return Long.toString(lastTime) + String.format("%03d", count);
    }

}