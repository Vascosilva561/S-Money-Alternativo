
export type FAQs = {

    dados: {
        id: string;
        question: string;
        answer: string;
        status: string;
        responsavel: string;
        categoria: string;
        created_at: string;
        updated_at: string;
        device: string;
    }
    total: number
}

export type FAQsApp = {
    dados: {
        id: string;
        question: string;
        answer: string;
        status: string;
        responsavel: string;
        categoria: string;
        device: string;
        created_at: string;
        updated_at: string;
        categoria_faq_id: string;
    }
    total: number
}

export type FAQsWeb = {
    dados: {
        id: string;
        question: string;
        answer: string;
        status: string;
        responsavel: string;
        categoria: string;
        device: string;
        created_at: string;
        updated_at: string;
        categoria_faq_id: string;
    }
    total: number
}

