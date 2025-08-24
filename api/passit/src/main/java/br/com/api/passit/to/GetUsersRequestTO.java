package br.com.api.passit.to;

import br.com.api.passit.db.UserTypeEnum;
import jakarta.validation.constraints.NotNull;

public record GetUsersRequestTO(
        String name,
        String email,
        UserTypeEnum userType,

        @NotNull
        int offset,

        @NotNull
        int limit,

        @NotNull
        SortUserEnum sort,

        @NotNull
        OrderEnum order
) {
}
