package br.com.api.passit.to;

import br.com.api.passit.db.UserTypeEnum;

import java.util.List;

public record GetUsersResponseTO(
        List<UsersResponseTO> users,
        int totalNumberOfRecords
) {
}
