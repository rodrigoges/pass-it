package br.com.api.passit.api;

import br.com.api.passit.exceptions.FlowException;
import br.com.api.passit.to.ErrorInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FlowException.class)
    public ResponseEntity<ErrorInfo> handleFlowException(FlowException ex) {
        var response = new ErrorInfo(
                ex.getMessage(),
                ex.getHttpStatus(),
                ex.getDateTime()
        );
        return ResponseEntity.status(ex.getHttpStatus()).body(response);
    }
}
