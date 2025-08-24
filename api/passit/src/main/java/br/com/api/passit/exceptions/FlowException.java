package br.com.api.passit.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class FlowException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final LocalDateTime dateTime;

    public FlowException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
        this.dateTime = LocalDateTime.now();
    }

    public FlowException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }
}
