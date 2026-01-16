package com.example.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrimaryContact {

    private String name;
    private String email;
    private String phone;
}
