package br.com.api.passit.to;

public record AddressesTO(
        String street,
        String city,
        String state,
        String zipCode
) {
}
