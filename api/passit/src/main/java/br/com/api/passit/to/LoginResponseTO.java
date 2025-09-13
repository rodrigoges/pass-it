package br.com.api.passit.to;

import java.util.UUID;

public record LoginResponseTO(
        String token,
        UUID userId
) {
}
