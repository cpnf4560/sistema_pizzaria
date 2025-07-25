package pizzaria;

import java.math.BigDecimal;

public class Pizza {
    private int id;
    private String nome;
    private String descricao;
    private BigDecimal precoPequena;
    private BigDecimal precoMedia;
    private BigDecimal precoGrande;

    public Pizza() {}

    public Pizza(int id, String nome, String descricao, BigDecimal precoPequena, BigDecimal precoMedia, BigDecimal precoGrande) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.precoPequena = precoPequena;
        this.precoMedia = precoMedia;
        this.precoGrande = precoGrande;
    }

    // Getters e Setters
    public int getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public BigDecimal getPrecoPequena() { return precoPequena; }
    public BigDecimal getPrecoMedia() { return precoMedia; }
    public BigDecimal getPrecoGrande() { return precoGrande; }

    public void setId(int id) { this.id = id; }
    public void setNome(String nome) { this.nome = nome; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setPrecoPequena(BigDecimal precoPequena) { this.precoPequena = precoPequena; }
    public void setPrecoMedia(BigDecimal precoMedia) { this.precoMedia = precoMedia; }
    public void setPrecoGrande(BigDecimal precoGrande) { this.precoGrande = precoGrande; }
}