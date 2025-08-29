package br.com.api.passit.api;

import br.com.api.passit.db.Users;
import br.com.api.passit.services.ItemsServices;
import br.com.api.passit.to.ItemsRequestTO;
import br.com.api.passit.to.ItemsResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
