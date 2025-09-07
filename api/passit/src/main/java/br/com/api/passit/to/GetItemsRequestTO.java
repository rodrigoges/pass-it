package br.com.api.passit.to;

import br.com.api.passit.db.CategoryItemEnum;
import br.com.api.passit.db.StatusItemEnum;
import jakarta.validation.constraints.NotNull;

public record GetItemsRequestTO(
        String title,
        CategoryItemEnum category,
        StatusItemEnum status,

        @NotNull
        int offset,

        @NotNull
        int limit,

        @NotNull
        SortItemEnum sort,

        @NotNull
        OrderEnum order
) {
}
