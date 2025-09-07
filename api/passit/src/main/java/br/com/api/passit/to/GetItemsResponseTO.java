package br.com.api.passit.to;

import java.util.List;

public record GetItemsResponseTO(
        List<ItemsResponseTO> items,
        int totalNumberOfRecords
) {
}
