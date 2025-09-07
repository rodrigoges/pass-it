package br.com.api.passit.to;

import br.com.api.passit.db.StatusItemEnum;

import java.time.OffsetDateTime;

public record RequisitionsResponseTO(
        StatusItemEnum status,
        OffsetDateTime date
) {
}
