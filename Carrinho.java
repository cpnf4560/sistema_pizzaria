package pizzaria;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class Carrinho {

    public static class ItemCarrinho {
        private Pizza pizza;
        private String tamanho; // "Pequena", "Média", "Grande"
        private BigDecimal precoUnitario;
        private int quantidade;

        public ItemCarrinho(Pizza pizza, String tamanho, BigDecimal precoUnitario) {
            this.pizza = pizza;
            this.tamanho = tamanho;
            this.precoUnitario = precoUnitario;
            this.quantidade = 1;
        }

        public Pizza getPizza() {
            return pizza;
        }

        public String getTamanho() {
            return tamanho;
        }

        public BigDecimal getPrecoUnitario() {
            return precoUnitario;
        }

        public int getQuantidade() {
            return quantidade;
        }

        public void incrementarQuantidade() {
            quantidade++;
        }

        public BigDecimal getPrecoTotal() {
            return precoUnitario.multiply(BigDecimal.valueOf(quantidade));
        }
    }

    private List<ItemCarrinho> itens;

    public Carrinho() {
        itens = new ArrayList<>();
    }

    public List<ItemCarrinho> getItens() {
        return itens;
    }

    public void adicionarPizza(Pizza pizza, int tamanhoIndex) {
        String tamanho;
        BigDecimal preco;

        switch (tamanhoIndex) {
            case 0:
                tamanho = "Pequena";
                preco = pizza.getPrecoPequena();
                break;
            case 1:
                tamanho = "Média";
                preco = pizza.getPrecoMedia();
                break;
            case 2:
                tamanho = "Grande";
                preco = pizza.getPrecoGrande();
                break;
            default:
                tamanho = "Pequena";
                preco = pizza.getPrecoPequena();
        }

        // Verificar se já existe pizza do mesmo tipo e tamanho no carrinho
        for (ItemCarrinho item : itens) {
            if (item.getPizza().getId() == pizza.getId() && item.getTamanho().equals(tamanho)) {
                item.incrementarQuantidade();
                return;
            }
        }

        // Se não existir, adiciona novo item
        itens.add(new ItemCarrinho(pizza, tamanho, preco));
    }

    public BigDecimal getTotalSemIva() {
        BigDecimal total = BigDecimal.ZERO;
        for (ItemCarrinho item : itens) {
            total = total.add(item.getPrecoTotal());
        }
        return total;
    }

    public BigDecimal getTotalComIva() {
        return getTotalSemIva().multiply(BigDecimal.valueOf(1.23)); // IVA 23%
    }

    @Override
    public String toString() {
        if (itens.isEmpty()) {
            return "Carrinho vazio.";
        }

        StringBuilder sb = new StringBuilder();
        for (ItemCarrinho item : itens) {
            sb.append(String.format("%dx %s (%s) - %.2f €%n",
                    item.getQuantidade(),
                    item.getPizza().getNome(),
                    item.getTamanho(),
                    item.getPrecoTotal().doubleValue()));
        }
        sb.append("----------------------------\n");
        sb.append(String.format("Total (IVA incl.): %.2f €%n", getTotalComIva().doubleValue()));
        return sb.toString();
    }

    public void limpar() {
        itens.clear();
    }
}