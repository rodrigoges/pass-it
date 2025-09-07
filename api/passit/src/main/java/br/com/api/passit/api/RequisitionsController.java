package br.com.api.passit.api;

import br.com.api.passit.db.Users;
import br.com.api.passit.services.RequisitionsServices;
import br.com.api.passit.to.ItemsRequestTO;
import br.com.api.passit.to.ItemsResponseTO;
import br.com.api.passit.to.RequisitionsRequestTO;
import br.com.api.passit.to.RequisitionsResponseTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/requisitions")
public class RequisitionsController {

    @Autowired
    private RequisitionsServices requisitionsServices;

    @PostMapping
    public ResponseEntity<RequisitionsResponseTO> create(@RequestBody RequisitionsRequestTO request,
                                                         @AuthenticationPrincipal Users authUser) {
        var response = requisitionsServices.request(request, authUser.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
