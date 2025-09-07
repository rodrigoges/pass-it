package br.com.api.passit.api;

import br.com.api.passit.db.Users;
import br.com.api.passit.services.ItemsServices;
import br.com.api.passit.to.GetItemsRequestTO;
import br.com.api.passit.to.GetItemsResponseTO;
import br.com.api.passit.to.ItemsRequestTO;
import br.com.api.passit.to.ItemsResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/items")
public class ItemsController {

    @Autowired
    private ItemsServices itemsServices;

    @PostMapping
    public ResponseEntity<ItemsResponseTO> create(@RequestBody ItemsRequestTO request,
                                                  @AuthenticationPrincipal Users authUser) {
        var response = itemsServices.create(request, authUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItemsResponseTO> update(@RequestBody ItemsRequestTO request,
                                                  @PathVariable UUID itemId,
                                                  @AuthenticationPrincipal Users authUser) {
        var response = itemsServices.update(request, itemId, authUser.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping
    public ResponseEntity<GetItemsResponseTO> get(@ModelAttribute GetItemsRequestTO request) {
        var response = itemsServices.get(request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemsResponseTO> getById(@PathVariable UUID itemId, @AuthenticationPrincipal Users authUser) {
        var response = itemsServices.getById(itemId, authUser.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> delete(@PathVariable UUID itemId, @AuthenticationPrincipal Users authUser) {
        itemsServices.delete(itemId, authUser.getUserId());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Item deleted successfully");
    }
}
