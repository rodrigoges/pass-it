package br.com.api.passit.to;

public record LoginRequestTO(
        String email,
        String password
) {
}
