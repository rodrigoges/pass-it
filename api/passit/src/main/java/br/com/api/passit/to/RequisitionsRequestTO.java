package br.com.api.passit.to;

import java.util.UUID;

public record RequisitionsRequestTO(
        UUID item,
        UUID requester
) {
}
