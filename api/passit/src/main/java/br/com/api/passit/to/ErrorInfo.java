package br.com.api.passit.to;

import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

public record ErrorInfo(
        String message,
        HttpStatus httpStatus,
        LocalDateTime dateTime
) {
}
