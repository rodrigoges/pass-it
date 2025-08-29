package br.com.api.passit.to;

import br.com.api.passit.db.CategoryItemEnum;
import br.com.api.passit.db.StatusItemEnum;

public record ItemsRequestTO(
        String title,
        String description,
        CategoryItemEnum category,
        String imageUrl,
        StatusItemEnum status
) {
}
