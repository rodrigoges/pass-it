package br.com.api.passit.to;

import br.com.api.passit.db.CategoryItemEnum;
import br.com.api.passit.db.StatusItemEnum;

import java.util.UUID;

public record ItemsResponseTO(
        UUID itemId,
        String title,
        String description,
        CategoryItemEnum category,
        String imageUrl,
        StatusItemEnum status
) {
}
