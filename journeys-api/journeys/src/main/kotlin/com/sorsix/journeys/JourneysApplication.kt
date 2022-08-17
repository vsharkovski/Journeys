package com.sorsix.journeys

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class JourneysApplication

fun main(args: Array<String>) {
    runApplication<JourneysApplication>(*args)
}
