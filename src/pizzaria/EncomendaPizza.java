package pizzaria;

import java.math.BigDecimal;

public class EncomendaPizza {
    private int id;
    private int encomendaId;
    private int pizzaId;
    private String tamanho;
    private BigDecimal preco;

    public EncomendaPizza(int encomendaId, int pizzaId, String tamanho, BigDecimal preco) {
        this.encomendaId = encomendaId;
        this.pizzaId = pizzaId;
        this.tamanho = tamanho;
        this.preco = preco;
    }

    public EncomendaPizza(int id, int encomendaId, int pizzaId, String tamanho, BigDecimal preco) {
        this.id = id;
        this.encomendaId = encomendaId;
        this.pizzaId = pizzaId;
        this.tamanho = tamanho;
        this.preco = preco;
    }

    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getEncomendaId() { return encomendaId; }
    public void setEncomendaId(int encomendaId) { this.encomendaId = encomendaId; }
    public int getPizzaId() { return pizzaId; }
    public void setPizzaId(int pizzaId) { this.pizzaId = pizzaId; }
    public String getTamanho() { return tamanho; }
    public void setTamanho(String tamanho) { this.tamanho = tamanho; }
    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    @Override
    public String toString() {
        return "EncomendaPizza{" +
                "id=" + id +
                ", encomendaId=" + encomendaId +
                ", pizzaId=" + pizzaId +
                ", tamanho='" + tamanho + '\'' +
                ", preco=" + preco +
                '}';
    }
}