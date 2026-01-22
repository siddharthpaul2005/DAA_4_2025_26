class Solution {
public:
    ListNode* reverseList(ListNode* head) {
       return reverseL(head,nullptr);     
    }
private:
    ListNode* reverseL(ListNode* curr, ListNode* prev) {
        if (curr == nullptr) {
            return prev; 
        }
        ListNode* temp = curr->next;
        curr->next = prev;
        return reverseL(temp, curr);
    }
};
